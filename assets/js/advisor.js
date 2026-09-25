const AI_ENDPOINT = "";
const form = document.getElementById("advisorForm");
const status = document.getElementById("advisorStatus");
const button = document.getElementById("advisorSubmit");
form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = document.getElementById("advisorQuestion").value.trim();
  if (!question) return;
  if (!AI_ENDPOINT) {
    status.textContent = "The professional advisor is prepared, but the secure AI backend is not connected yet. No question is sent or stored.";
    status.dataset.state = "local";
    return;
  }
  button.disabled = true;
  status.textContent = "Connecting…";
  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {"Accept":"application/json","Content-Type":"application/json"},
      body: JSON.stringify({
        question: question,
        area: document.getElementById("advisorArea").value,
        language: document.getElementById("advisorLanguage").value,
        depth: document.getElementById("advisorDepth").value,
        web: document.getElementById("advisorWeb").checked
      })
    });
    if (!response.ok) throw new Error("Request failed");
    const data = await response.json();
    status.textContent = data.answer || "The advisor returned no answer.";
    status.dataset.state = data.answer ? "success" : "error";
  } catch (_) {
    status.textContent = "The secure advisor service is temporarily unavailable.";
    status.dataset.state = "error";
  } finally {
    button.disabled = false;
  }
});