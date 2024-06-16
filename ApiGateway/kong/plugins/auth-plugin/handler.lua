local http = require "resty.http"
local cjson = require "cjson"

local AuthHandler = {
  PRIORITY = 1000,
  VERSION = "1.0.0",
}

local function validate_token(token, conf)
    local httpc = http.new()
    local res, err = httpc:request_uri(conf.validation_endpoint, {
        method = "GET",
        ssl_verify = conf.ssl_verify,
        headers = {
            ["Content-Type"] = "application/x-www-form-urlencoded",
            ["Authorization"] = "Bearer " .. token
        },
    })

    if not res then
        kong.log.err("Failed to request: ",err)
        return nil
    end

    return {
        status = res.status,
        body = res.body
    }
end

function AuthHandler:access(conf)
   local cookie_name = "access_token" 
   local var_name = "cookie_" .. cookie_name
   local token = ngx.var[var_name]

    if not token then
        kong.log.err("Access token is missing!")
        return
    end

    kong.log.err("Access token: ", token)

    local res = validate_token(token, conf)

    if not res then
        kong.log.err("Failed to verify token")
        return kong.response.exit(500, { message = "Internal Server Error" })
    end

    if res.status ~= 200 then
        kong.log.err("Failed to verify token: ", res.body)
        return kong.response.exit(res.status, res.body)
    end

    local user_info = res.body;
    
    kong.log.err("header",conf.user_header);
    
    kong.service.request.set_header(conf.user_header, cjson.encode(user_info))
end

return AuthHandler
