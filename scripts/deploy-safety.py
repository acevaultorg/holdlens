#!/usr/bin/env python3
"""Local deployment mutex and bounded freeze guard (macOS/Linux, no packages)."""
import datetime
import fcntl
import os
import signal
import subprocess
import sys


def run(command, timeout=None, pass_fds=()):
    child = subprocess.Popen(command, start_new_session=True, pass_fds=pass_fds)

    class Interrupted(Exception):
        pass

    def stop(signum, _frame):
        raise Interrupted(signum)

    for sig in (signal.SIGTERM, signal.SIGINT, signal.SIGHUP):
        signal.signal(sig, stop)
    try:
        return child.wait(timeout=timeout)
    except Interrupted as interruption:
        for sig in (signal.SIGTERM, signal.SIGINT, signal.SIGHUP):
            signal.signal(sig, signal.SIG_IGN)
        os.killpg(child.pid, signal.SIGTERM)
        try:
            child.wait(timeout=5)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            child.wait()
        return 128 + interruption.args[0]
    except subprocess.TimeoutExpired:
        os.killpg(child.pid, signal.SIGKILL)
        child.wait()
        print(f"deploy-cf: rg-freeze-guard timed out after {timeout:g}s; deployment blocked", file=sys.stderr)
        return 124


def main():
    mode, *command = sys.argv[1:]
    if mode == "guard":
        timeout = float(os.environ.get("RG_GUARD_TIMEOUT_SECONDS", "120"))
        if not 0 < timeout < float("inf"):
            raise ValueError("RG_GUARD_TIMEOUT_SECONDS must be positive and finite")
        return run(command, timeout)
    if mode != "lock":
        raise ValueError("expected lock or guard")
    # Never unlink the lock inode: removing it lets racing processes lock different
    # files. The OS releases flock even after a crash; dead PID metadata is replaced.
    with open(".deploy.lock", "a+", encoding="utf-8") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            lock.seek(0)
            holder = lock.read().strip() or "holder metadata pending"
            print(f"deploy-cf: deployment already running ({holder})", file=sys.stderr)
            return 1
        lock.seek(0)
        lock.truncate()
        lock.write(f"PID {os.getpid()} started {datetime.datetime.now(datetime.timezone.utc).isoformat()}\n")
        lock.flush()
        # Inherit the lock in the shell too, so killing the supervisor alone cannot
        # unlock a checkout while its build is still running.
        os.set_inheritable(lock.fileno(), True)
        return run(command, pass_fds=(lock.fileno(),))


if __name__ == "__main__":
    sys.exit(main())
