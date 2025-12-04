from langgraph.graph import StateGraph, END
import google.generativeai as genai
from embedder import embed_text
from chroma_client import get_user_collection


# ---- STATE ----
class GraphState(dict):
    user_id: str
    question: str
    context: str
    answer: str


# ---- NODES ----

def retrieve(state: GraphState):
    user_id = state["user_id"]

    query = state["question"]
    embedding = embed_text(query)

    # get user-specific collection
    collection = get_user_collection(user_id)

    results = collection.query(
        query_embeddings=[embedding],
        n_results=5
    )

    docs = results["documents"][0] if results["documents"] else []
    state["context"] = docs
    return state


def generate(state: GraphState):
    model = genai.GenerativeModel("gemini-2.5-flash")

    context_text = "\n\n".join(state['context'])

    prompt = f"""
    Use ONLY the context below to answer:

    CONTEXT:
    {context_text}

    QUESTION:
    {state['question']}
    """

    answer = model.generate_content(prompt)
    state["answer"] = answer.text
    return state


# ---- GRAPH ----

workflow = StateGraph(GraphState)

workflow.add_node("retrieve", retrieve)
workflow.add_node("generate", generate)

workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "generate")
workflow.add_edge("generate", END)

app_graph = workflow.compile()
