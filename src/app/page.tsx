export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/B3E%3C/g%3E%3C/svg%3E")'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-12">
                <h1 className="text-5xl font-extrabold leading-tight text-center mb-4">Welcome to AI-YouTube Studio</h1>
                <p className="text-xl text-gray-400 text-center mb-12">Your AI-powered co-pilot for YouTube success.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Subscribers</h2>
                            <p className="text-5xl font-bold text-indigo-400">125,000</p>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Views</h2>
                            <p className="text-5xl font-bold text-teal-400">10,500,000</p>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Revenue</h2>
                            <p className="text-5xl font-bold text-amber-400">$25,000</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
