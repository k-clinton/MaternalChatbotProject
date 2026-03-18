import ChatbotInterface from '../components/Chatbot/ChatbotInterface';

export default function Chatbot() {
  return (
    <div className="h-full flex flex-col p-6 md:p-10 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-maternal-900 tracking-tight">Care Assistant</h1>
        <p className="text-maternal-600 mt-2 text-lg">Ask questions about your symptoms, medications, or general pregnancy concerns.</p>
      </header>
      
      <ChatbotInterface />
    </div>
  );
}
