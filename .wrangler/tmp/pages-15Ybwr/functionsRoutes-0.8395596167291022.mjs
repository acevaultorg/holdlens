import { onRequestPost as __api_subscribe_ts_onRequestPost } from "/Users/paulodevries/Library/Mobile Documents/com~apple~CloudDocs/AceVault/ CLUSTER01-AceVault/VAULT01-Paulo Projects/Stocks/holdlens/functions/api/subscribe.ts"

export const routes = [
    {
      routePath: "/api/subscribe",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_subscribe_ts_onRequestPost],
    },
  ]