import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SERVICES } from '../../lib/services';

@Component({
    selector: 'app-booking',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './booking.html',
})
export class Booking implements OnInit {
    step = 1; // 1: Service, 2: Date/Time, 3: Details, 4: Confirmation

    // Data for Step 1
    barberServices = SERVICES.slice(0, 7); // Only barber services as requested in context

    // Data for Step 2
    weekDays: { name: string; date: string; display: string }[] = [];
    currentWeekStart: Date = new Date();
    timeSlots: string[] = []; // 10:00, 10:30...

    // Selection
    selectedService: any = null;
    selectedDate: string = '';
    selectedTime: string = '';

    // Data for Step 3
    clientName = '';
    clientPhone = '';

    // Appointments for checking availability
    existingAppointments: any[] = [];

    constructor(private router: Router) { }

    ngOnInit() {
        this.generateTimeSlots();
        this.setInitialWeek();
        this.loadAppointments();
    }

    // --- Logic for Available Slots ---
    generateTimeSlots() {
        // Re-use Logic from Admin
        // Morning: 10:00 - 13:00 (12:30 last slot)
        // Afternoon: 16:00 - 20:00 (20:00 last slot?)
        this.timeSlots = [
            '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00',
            '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
        ];
    }

    setInitialWeek() {
        const now = new Date();
        const day = now.getDay();
        // If today is Sunday (0), go to Monday (1). Else stay or adjust.
        // Let's just start from TODAY to show next 6 days?
        // User probably wants to see upcoming availability.
        // Let's mimic Admin calendar logic for consistency but start from Today?
        // Admin starts on Monday. 
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
        this.currentWeekStart = new Date(now.setDate(diff));

        // Ensure we don't show PAST dates as clickable?
        this.generateWeekDays();
    }

    generateWeekDays() {
        this.weekDays = [];
        const daysNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const start = new Date(this.currentWeekStart);

        for (let i = 0; i < 6; i++) {
            const date = new Date(start);
            date.setDate(this.currentWeekStart.getDate() + i);

            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;

            this.weekDays.push({
                name: daysNames[i],
                date: dateStr,
                display: `${date.getDate()}`
            });
        }
    }

    changeWeek(offset: number) {
        this.currentWeekStart.setDate(this.currentWeekStart.getDate() + (offset * 7));
        this.generateWeekDays();
    }

    loadAppointments() {
        const stored = localStorage.getItem('appointments');
        if (stored) {
            this.existingAppointments = JSON.parse(stored);
        }
    }

    isSlotTaken(date: string, time: string): boolean {
        return this.existingAppointments.some(a => a.date === date && a.time === time);
    }

    isPast(date: string, time: string): boolean {
        // Very simple check
        const now = new Date();
        const [y, m, d] = date.split('-').map(Number);
        const [h, min] = time.split(':').map(Number);
        const slotTime = new Date(y, m - 1, d, h, min);
        return slotTime < now;
    }

    // --- Steps Logic ---
    selectService(service: any) {
        this.selectedService = service;
        this.step = 2;
    }

    selectSlot(date: string, time: string) {
        if (this.isSlotTaken(date, time) || this.isPast(date, time)) return;
        this.selectedDate = date;
        this.selectedTime = time;
        this.step = 3;
    }

    confirmBooking() {
        if (!this.clientName || !this.clientPhone) return;

        const newAppt = {
            id: Math.random().toString(36).substr(2, 9),
            date: this.selectedDate,
            time: this.selectedTime,
            client: this.clientName, // In real app, maybe detailed object
            type: this.selectedService.title,
            price: this.selectedService.price
        };

        this.existingAppointments.push(newAppt);
        localStorage.setItem('appointments', JSON.stringify(this.existingAppointments));

        this.step = 4;
    }

    goBack() {
        if (this.step > 1) this.step--;
    }
}
