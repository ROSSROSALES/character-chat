const { OpenAI } = require('openai');

exports.handler = async (event) => {
  // Log the incoming request body for debugging
  console.log('Received Request Body:', event.body);

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

  // Ensure the `messages` field is present and is an array
  if (!requestBody.messages || !Array.isArray(requestBody.messages)) {
    console.error('Missing or invalid `messages` field:', requestBody);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing or invalid `messages` field' }),
    };
  }
  
    const openai = new OpenAI({
      baseURL: "https://api-inference.huggingface.co/v1/",
      apiKey: process.env.OPENAI_API_KEY, // Store your API key in Netlify environment variables
  });

  try {
    // Log the messages being sent to the AI
    console.log('Sending messages to AI:', requestBody.messages);

    // Call the AI API
    const response = await openai.chat.completions.create({
      model: 'meta-llama/Llama-3.2-3B-Instruct', // Replace with your model name
      messages: requestBody.messages, // Use the conversation history
    });

    // Log the AI response for debugging
    console.log('AI Response:', response);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.choices[0].message.content }),
    };
  } catch (error) {
    console.error('Error calling AI API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred' }),
    };
  }
};
