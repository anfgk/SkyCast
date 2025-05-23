import { WeatherDashboard } from "@/widgets/WeatherDashboard";

function App() {
  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white p-6">
      <div className="max-w-[1200px] mx-auto bg-[#2C2C2E] rounded-3xl p-6 shadow-xl">
        <WeatherDashboard />
      </div>
    </div>
  );
}

export default App;
