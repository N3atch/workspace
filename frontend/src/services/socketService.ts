import { io, Socket } from 'socket.io-client';
import { Vacation } from '../store/slices/vacationSlice';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001', {
        transports: ['websocket'],
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onVacationUpdated(callback: (vacation: Vacation) => void) {
    if (!this.socket) {
      this.connect();
    }
    this.socket?.on('vacationUpdated', callback);
  }

  onVacationDeleted(callback: (vacationId: number) => void) {
    if (!this.socket) {
      this.connect();
    }
    this.socket?.on('vacationDeleted', callback);
  }

  onVacationCreated(callback: (vacation: Vacation) => void) {
    if (!this.socket) {
      this.connect();
    }
    this.socket?.on('vacationCreated', callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }
}

export const socketService = new SocketService();

