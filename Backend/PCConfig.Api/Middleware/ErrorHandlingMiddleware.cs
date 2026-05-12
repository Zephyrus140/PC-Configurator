using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json;

namespace PCConfig.Api.Middleware;

public class ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException ex)
        {
            logger.LogWarning("Validation error: {Message}", ex.Message);
            await WriteJson(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning("Not found: {Message}", ex.Message);
            await WriteJson(context, HttpStatusCode.NotFound, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            await WriteJson(context, HttpStatusCode.InternalServerError, "Внутренняя ошибка сервера.");
        }
    }

    private static Task WriteJson(HttpContext context, HttpStatusCode status, string message)
    {
        context.Response.StatusCode  = (int)status;
        context.Response.ContentType = "application/json";
        return context.Response.WriteAsync(
            JsonSerializer.Serialize(new { error = message }));
    }
}
