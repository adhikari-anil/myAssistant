import * as dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.API;
const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const clearButton = document.getElementById("clear-button");
const speakButton = document.getElementById("speak-button"); // Corrected the variable name
let gpt3Response = ""; // Variable to store GPT-3 response

// for send button...
sendButton.addEventListener("click", async () => {
  const userMessage = userInput.value;
  appendMessage("You", userMessage);
  userInput.value = "";

  // Send user message to GPT-3
  gpt3Response = await sendMessageToGPT3(userMessage); // Store GPT-3 response
  appendMessage("UnKnown", gpt3Response);
  voice.textContent = "voice";
  recognition.stop();
});

// for speak button
speakButton.addEventListener("click", function () {
  if (gpt3Response) {
    const utterance = new SpeechSynthesisUtterance(gpt3Response);
    utterance.voice = synth.getVoices()[0];
    synth.speak(utterance);
  }
});

async function sendMessageToGPT3(message) {       // function to generate response 
  const response = await fetch(
    "https://api.openai.com/v1/engines/text-davinci-003/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: message,
        max_tokens: 200, // Adjust as needed
      }),
    }
  );
  console.log(response);

  const data = await response.json();
  console.log(data.choices[0].text);
  return data.choices[0].text;
}

function appendMessage(sender, message) {               // function for levelling user-bot chatting
  const messageDiv = document.createElement("div");
  if (sender == "You") {
    messageDiv.id = "left";
  } else {
    messageDiv.id = "right";
  }
  messageDiv.innerText = `${sender}: ${message}`;
  chatContainer.appendChild(messageDiv);
}

// For screen clearance...
clearButton.addEventListener("click", function () {
  const element = document.getElementById("chat-container");
  element.remove();
});

//For recording user saying...
const voice = document.getElementById("start-recognition");
const synth = window.speechSynthesis;
const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.continuous = "true";  //this will enable continious recording..
let isRecording = false; // to keep record of recognition state

recognition.onresult = function (event) {
  const transcript = event.results[0][0].transcript;
  userInput.value = transcript;  // display the text from recoder
};

recognition.onstart = function (){
  isRecording = true;
  voice.textContent = "Recording";
}

recognition.onend = function () {
  isRecording = false;
  voice.textContent = "Voice";
};

voice.addEventListener("click", function () {
  if (isRecording) {
    recognition.stop();
  } else {
    recognition.start();
    userInput.textContent = ""; // Clear the displayed text
  }
});

