// Mock real-time service for notifications and events

class RealtimeService {
  constructor() {
    this.listeners = new Map();
    this.intervals = [];
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event).delete(callback);
    };
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  startMocking() {
    // Stop existing if any
    this.stopMocking();

    // Mock appointment update every 30 seconds
    this.intervals.push(
      setInterval(() => {
        this.emit('notification', {
          id: Date.now(),
          type: 'appointment',
          message: 'A new appointment has been scheduled.',
          details: {
            patientName: 'Jane Doe',
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            time: '10:30 AM',
            status: 'Pending'
          },
          read: false,
          timestamp: new Date().toISOString()
        });
      }, 30000)
    );

    // Mock report upload every 45 seconds
    this.intervals.push(
      setInterval(() => {
        this.emit('notification', {
          id: Date.now() + 1,
          type: 'report',
          message: 'John Doe uploaded a new MRI report.',
          read: false,
          timestamp: new Date().toISOString()
        });
      }, 45000)
    );
  }

  stopMocking() {
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }
}

export const realtimeService = new RealtimeService();
