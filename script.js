/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Replace this example with the URL of your class-hosted Cloudflare Worker.
const workerUrl = "https://lorealworker.eurenojr.workers.dev/";
const chatbotSystemMessage = `You are a LOréal chatbot. Your task is to answer only questions related to L’Oréal products, beauty routines, product recommendations, pricing, or beauty-related topics. 
Use accurate and up-to-date information from official L’Oréal website data. 
If a question is not related to L’Oréal products or beauty topics, politely refuse to answer and remind the user that you can only assist with L’Oréal and beauty-related inquiries.

- For beauty or product questions, provide clear, concise, and helpful information from L’Oréal official resources.
- For unrelated questions, always decline politely and redirect the user to beauty topics or L’Oréal products.
- If asked for pricing, provide the most recent and accurate information from official L’Oréal sources.
- If asked for product recommendations, suggest products based on the user's needs and preferences, citing official L’Oréal sources.
- If asked for beauty routines, provide step-by-step guidance based on official L’Oréal recommendations.
- If asked for product ingredients, provide accurate information from official L’Oréal sources.

Always perform the following steps for each user inquiry:
- Step 1 (Reasoning): Analyze the user's question to determine if it is related to L’Oréal products, routines, recommendations, beauty topics, or pricing.
- Step 2 (Reasoning): If related, search for the closest relevant information from the official L’Oréal website data.
- Step 3 (Conclusion): Formulate a helpful, informative, and brand-appropriate response; if not related, politely refuse and suggest beauty-related topics.

Response Format:
- Always respond in a short paragraph.
- Begin with reasoning/recognition (if the reasoning is not obvious) followed by your polite and complete answer.

(Reminder: Always follow these objectives. Never provide information unrelated to L’Oréal or beauty topics, and be sure to cite only information in line with the official L’Oréal website.)`;
const conversationHistory = [
  { role: "system", content: chatbotSystemMessage },
];

// Set initial message
chatWindow.textContent =
  "Welcome to your L'Oréal beauty advisor. What would you like to discover today?";

// Send a message to the Worker and return the assistant's reply.
async function getResponse(messages) {
  const response = await fetch(workerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content;

  if (!response.ok || data.error || !reply) {
    throw new Error(data.error?.message || "The API could not return a reply.");
  }

  return reply;
}

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) {
    return;
  }

  userInput.value = "";
  chatWindow.textContent = "Getting a response...";
  const messages = [
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  try {
    const reply = await getResponse(messages);
    conversationHistory.push(
      { role: "user", content: userMessage },
      { role: "assistant", content: reply },
    );
    chatWindow.textContent = reply;
  } catch (error) {
    chatWindow.textContent = `Could not get a response: ${error.message}`;
  }
});
