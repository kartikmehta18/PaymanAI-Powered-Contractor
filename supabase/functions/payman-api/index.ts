import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-payman-api-secret',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

// Base URL for Payman API
const PAYMAN_API_BASE_URL = "https://agent.payman.ai/api";

// Default API key if none is provided
const DEFAULT_API_KEY = "YWd0LTFmMDA3MGE0LWMwZTgtNjQzYS04NjI3LTJmOWFiNmFkMDA2YTpsYzVUTHM2b0dMdU5CQTFocUJCaFB0R3MyNg==";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const functionName = pathSegments[pathSegments.length - 1]; // Get the last segment
    
    // Get API key from request headers or use the default
    const apiKey = req.headers.get('x-payman-api-secret') || Deno.env.get("PAYMAN_API_SECRET") || DEFAULT_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing request for: ${functionName}`);
    
    // Parse request body if it exists
    let body = {};
    if (req.method !== 'GET') {
      try {
        body = await req.json();
        console.log("Request body:", JSON.stringify(body));
      } catch (e) {
        console.log("No body provided or invalid JSON");
      }
    }

    // Determine the operation based on the URL path or query parameters
    let response;
    
    if (req.method === 'POST' && body && 'payeeId' in body && 'amountDecimal' in body) {
      response = await handleSendPayment(apiKey, body);
    } else if (req.method === 'POST' && body && 'type' in body && 'name' in body) {
      response = await handleCreatePayee(apiKey, body);
    } else if (req.method === 'GET' && url.pathname.includes('search-payees')) {
      response = await handleSearchPayees(apiKey);
    } else if (body && 'currency' in body) {
      const currency = body.currency || 'USD';
      response = await handleGetBalance(apiKey, currency);
    } else {
      // Default to search-payees if no other operation matches
      response = await handleSearchPayees(apiKey);
    }

    console.log("API response:", JSON.stringify(response));

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function handleSendPayment(apiKey, body) {
  const options = {
    method: 'POST',
    headers: {
      'x-payman-api-secret': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amountDecimal: body.amountDecimal,
      payeeId: body.payeeId,
      memo: body.memo || "",
      metadata: body.metadata || {}
    })
  };

  console.log("Sending payment request with options:", JSON.stringify(options));
  const response = await fetch(`${PAYMAN_API_BASE_URL}/payments/send-payment`, options);
  return await response.json();
}

async function handleCreatePayee(apiKey, body) {
  const options = {
    method: 'POST',
    headers: {
      'x-payman-api-secret': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };

  console.log("Creating payee with options:", JSON.stringify(options));
  const response = await fetch(`${PAYMAN_API_BASE_URL}/payments/payees`, options);
  return await response.json();
}

async function handleSearchPayees(apiKey) {
  const options = {
    method: 'GET',
    headers: {
      'x-payman-api-secret': apiKey
    }
  };

  console.log("Searching payees with options:", JSON.stringify(options));
  const response = await fetch(`${PAYMAN_API_BASE_URL}/payments/search-payees`, options);
  return await response.json();
}

async function handleGetBalance(apiKey, currency = 'USD') {
  const options = {
    method: 'GET',
    headers: {
      'x-payman-api-secret': apiKey
    }
  };

  console.log(`Getting balance for currency ${currency} with options:`, JSON.stringify(options));
  const response = await fetch(`${PAYMAN_API_BASE_URL}/balances/currencies/${currency}`, options);
  return await response.json();
}
