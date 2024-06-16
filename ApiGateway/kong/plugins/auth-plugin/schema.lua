local typedefs = require "kong.db.schema.typedefs"

return {
  name = "auth-plugin",
  fields = {
    { consumer = typedefs.no_consumer },
    { config = {
        type = "record",
        fields = {
          { validation_endpoint = typedefs.url({ required = true }) },
          { ssl_verify	= { type = "boolean", default = false, required = false } },
          { user_header	= { type = "string", default = "X-User-Info", required = true } },
      },
    },
  },
}
}