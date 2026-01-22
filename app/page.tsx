
import React from 'react';

const AppPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">OpsVantage AI</h1>
      <p className="text-lg mb-8">
        The Autonomous AI Agent for YouTube Content Creation, Scheduling, and Publishing
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Core Features</h2>
          <ul className="list-disc list-inside">
            <li>Automated Content Generation</li>
            <li>Intelligent Scheduling</li>
            <li>Seamless Publishing</li>
            <li>Audience Analytics</li>
            <li>Monetization Insights</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Architecture</h2>
          <p>
            OpsVantage AI is built on a modern, serverless architecture, leveraging the power of Google's Generative AI and Firebase to deliver a robust and scalable platform.
          </p>
          <p>
            The frontend is built with Next.js and Tailwind CSS, providing a responsive and user-friendly interface.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
