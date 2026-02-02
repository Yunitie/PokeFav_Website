using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace PokeFav.Api.Middleware;

/// <summary>
/// Middleware global de gestion d'erreurs.
/// Intercepte les exceptions non gérées et renvoie une réponse JSON uniforme.
/// </summary>
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        // Si la réponse a déjà commencé, on ne peut plus la modifier proprement
        if (context.Response.HasStarted)
        {
            _logger.LogError(exception, "Unhandled exception after response started for {Path}", context.Request.Path);
            return;
        }

        var statusCode = HttpStatusCode.InternalServerError;
        var message = "Internal Server Error";

        switch (exception)
        {
            case ArgumentException argEx:
                statusCode = HttpStatusCode.BadRequest;
                message = argEx.Message;
                break;

            case InvalidOperationException invalidOpEx:
                // Selon les cas, on pourrait mapper en 400 ou 409.
                // Pour l'instant, on renvoie 400 avec le message exact.
                statusCode = HttpStatusCode.BadRequest;
                message = invalidOpEx.Message;
                break;
        }

        _logger.LogError(exception,
            "Unhandled exception while processing request {Method} {Path}. Returning {StatusCode}",
            context.Request.Method,
            context.Request.Path,
            (int)statusCode);

        context.Response.Clear();
        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json; charset=utf-8";

        var payload = JsonSerializer.Serialize(new { error = message });
        await context.Response.WriteAsync(payload);
    }
}

