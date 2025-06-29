import { WeatherDashboard } from "@/widgets/WeatherDashboard";

function App() {
  return (
    <div className="h-screen bg-[#1C1C1E] text-white p-4">
      <div className="h-full max-w-6xl mx-auto bg-[#2C2C2E] rounded-3xl p-4 shadow-xl overflow-hidden">
        <WeatherDashboard />
      </div>
    </div>
  );
}

export default App;
