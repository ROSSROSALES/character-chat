const { OpenAI } = require('openai');

exports.handler = async (event) => {
    const openai = new OpenAI({
      baseURL: "https://api-inference.huggingface.co/v1/",
      apiKey: process.env.OPENAI_API_KEY, // Store your API key in Netlify environment variables
  });

  const { message } = JSON.parse(event.body);

  try {
    const response = await openai.chat.completions.create({
      model: 'meta-llama/Llama-3.2-3B-Instruct',
      messages: [{ role: 'user', content: message }],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.choices[0].message.content }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred' }),
    };
  }
};
