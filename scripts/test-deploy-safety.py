#!/usr/bin/env python3
"""Exercise the real entry point in disposable checkouts without network/builds."""
import os
from pathlib import Path
import shutil
import signal
import subprocess
import tempfile
import time
import unittest

SCRIPTS = Path(__file__).resolve().parent


class DeploySafety(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / "scripts").mkdir()
        for name in ("deploy-cf.sh", "deploy-safety.py"):
            shutil.copy(SCRIPTS / name, self.root / "scripts" / name)
        self.body("exit 0")

    def tearDown(self):
        self.tmp.cleanup()

    def body(self, body):
        (self.root / "scripts/deploy-cf-locked.sh").write_text(body)

    def deploy(self, **kwargs):
        return subprocess.run(["bash", "scripts/deploy-cf.sh"], cwd=self.root,
                              capture_output=True, text=True, timeout=10, **kwargs)

    def test_two_deploys_refuse_with_pid_and_start_time(self):
        self.body("touch ready; sleep 30")
        first = subprocess.Popen(["bash", "scripts/deploy-cf.sh"], cwd=self.root)
        try:
            deadline = time.monotonic() + 5
            while not (self.root / "ready").exists():
                self.assertLess(time.monotonic(), deadline)
                time.sleep(.02)
            second = self.deploy()
            self.assertEqual(second.returncode, 1)
            self.assertIn("deployment already running (PID", second.stderr)
            self.assertIn("started", second.stderr)
        finally:
            first.terminate()
            first.wait(timeout=8)
        self.body("exit 0")
        self.assertEqual(self.deploy().returncode, 0)

    def test_stale_metadata_is_reclaimed(self):
        (self.root / ".deploy.lock").write_text("PID 99999999 started yesterday")
        self.assertEqual(self.deploy().returncode, 0)
        self.assertNotIn("99999999", (self.root / ".deploy.lock").read_text())

    def test_failure_releases_lock(self):
        self.body("exit 7")
        self.assertEqual(self.deploy().returncode, 7)
        self.body("exit 0")
        self.assertEqual(self.deploy().returncode, 0)

    def test_timeout_blocks_following_commands_and_releases_lock(self):
        self.body("set -e\npython3 scripts/deploy-safety.py guard sleep 30\ntouch uploaded")
        result = self.deploy(env={**os.environ, "RG_GUARD_TIMEOUT_SECONDS": ".2"})
        self.assertEqual(result.returncode, 124)
        self.assertIn("rg-freeze-guard timed out", result.stderr)
        self.assertFalse((self.root / "uploaded").exists())
        self.body("exit 0")
        self.assertEqual(self.deploy().returncode, 0)

    def test_real_body_success_and_restore(self):
        # Replace only external work in a COPY; run all production control flow.
        body = (SCRIPTS / "deploy-cf-locked.sh").read_text()
        body = body.replace('"$HOME/.claude/bin/rg-freeze-guard.mjs"', '"$PWD/guard"')
        body = body.replace('"$HOME/Local/VAULT-Fleet/scripts/rg-freeze-guard.mjs"', '"$PWD/guard"')
        self.body(body)
        (self.root / "guard").touch()
        binaries = self.root / "bin"
        binaries.mkdir()
        for name, text in {"npm": "#!/bin/sh\nexit 0\n", "node": "#!/bin/sh\necho guard >> calls\nexit 0\n"}.items():
            path = binaries / name
            path.write_text(text)
            path.chmod(0o755)
        for directory in ("insiders/alice", "insiders/company", "api/v1/insiders/officer", "api/v1/events/company"):
            target = self.root / "out" / directory
            target.mkdir(parents=True)
            (target / "data").touch()
        (self.root / "scripts/cf-pages-chunked-deploy.py").write_text(
            "from pathlib import Path\nassert not Path('out/insiders/alice').exists()\nPath('uploaded').touch()\n")
        result = self.deploy(env={**os.environ, "PATH": str(binaries) + os.pathsep + os.environ["PATH"]})
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue((self.root / "uploaded").exists())
        self.assertTrue((self.root / "out/insiders/alice/data").exists())
        self.assertTrue((self.root / "out/api/v1/insiders/officer/data").exists())
        self.assertTrue((self.root / "out/api/v1/events/company/data").exists())
        self.assertEqual(len((self.root / "calls").read_text().splitlines()), 3)


if __name__ == "__main__":
    unittest.main(verbosity=2)
