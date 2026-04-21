const { OpenAI } = require('openai');

exports.handler = async (event) => {
  console.log('API KEY:', process.env.OPENROUTER_API_KEY);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Parse the request body
  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (error) {
    console.error('Error parsing request body:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  // Validate messages field
  if (!requestBody.messages || !Array.isArray(requestBody.messages)) {
    console.error('Missing or invalid messages field:', requestBody);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing or invalid messages field' }),
    };
  }

  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  try {
    console.log('Sending messages to AI:', requestBody.messages);

    const response = await openai.chat.completions.create({
      model: 'inclusionai/ling-2.6-flash:free',
      messages: requestBody.messages,
    });

    const reply = response?.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error('Model returned an empty response');
    }

    console.log('AI Response:', reply);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };

  } catch (error) {
    console.error('Error calling AI API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'An error occurred calling the AI',
        detail: error.message,
      }),
    };
  }
};
