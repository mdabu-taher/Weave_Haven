import React from 'react';
import { Line } from 'react-chartjs-2';

export default function TestChart() {
  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Line
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [
            { label: 'Demo Data', data: [12, 19, 3, 5], tension: 0.3 }
          ]
        }}
      />
    </div>
  );
}
