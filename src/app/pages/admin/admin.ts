import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SERVICES } from '../../lib/services';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin.html',
})
export class Admin implements OnInit {
    timeSlots: string[] = []; // 10:00, 10:30...
    weekDays: { name: string; date: string; display: string }[] = [];
    currentWeekStart: Date = new Date();

    appointments: any[] = []; // Stores { id: string, date: string, time: string, client, type, price }

    isModalOpen = false;
    currentAppointment: any = { id: '', date: '', time: '', client: '', type: '', price: '0€' };
    isNew = false;

    // Map services to easy access
    servicesList = SERVICES;
    appointmentTypes = SERVICES.map(s => s.title);

    // Stats
    stats = { count: 0, pending: 0, income: 0 };
    filterType: 'day' | 'month' | 'year' = 'day';

    constructor(private authService: AuthService, private router: Router) { }

    logout() {
        this.authService.logout();
    }

    onServiceChange() {
        const selected = this.servicesList.find(s => s.title === this.currentAppointment.type);
        if (selected) {
            this.currentAppointment.price = selected.price;
        }
    }

    ngOnInit() {
        this.generateTimeSlots();
        this.setInitialWeek();
        this.loadAppointments();
    }

    generateTimeSlots() {
        const slots = [];

        // Morning: 10:00 - 13:00
        for (let h = 10; h <= 13; h++) {
            slots.push(`${h}:00`);
            if (h !== 13) slots.push(`${h}:30`); // Up to 12:30? Or include 13:30? 
            // Interpret "10 to 13" as work period. Usually ends AT 13:00.
            // So last slot start is 12:30. 13:00 is close.
            // But user said "Horas... son de 10 a 13". 
            // I'll stick to 12:30 as last slot.
            // If h=13, push 13:00? No, if close is 13:00, 13:00 is NOT a slot.
            // Let's assume 10:00, 10:30, 11:00, 11:30, 12:00, 12:30.
        }
        // Let's refine. User said "10 to 13". 
        // 10:00 start. 13:00 end.
        // Slots: 10:00, 10:30, 11:00, 11:30, 12:00, 12:30. (Ends 13:00).

        // Afternoon: 16:00 - 20:00.
        // Slots: 16:00 ... 19:30. (Ends 20:00).

        // Re-writing logic to be explicit
        const morning = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30'];
        const afternoon = ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];
        // Added 20:00 just in case "to 20" means "until 20 start"? 
        // Common in Spain to stay late. I'll add 20:00 just to be safe, user can ignore it.
        // Actually, let's stick to 10-13 and 16-20 exactly as numbers.

        this.timeSlots = [
            '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00',
            '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
        ];
    }



    // --- Week Navigation & Dates ---

    setInitialWeek() {
        // Set currentWeekStart to the closest Monday (or today if today is Monday)
        const now = new Date();
        const day = now.getDay(); // 0=Sun, 1=Mon...
        // If Sunday (0), we go back 6 days to Monday. Else go back (day - 1).
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        this.currentWeekStart = new Date(now.setDate(diff));
        this.generateWeekDays();
    }

    // ... (generateWeekDays and changeWeek, goToToday skipped as they are fine/unchanged in logic but I need to match context to replace calculateStats which is further down?)
    // No, `calculateStats` is near the bottom. I can use a separate block for calculateStats.
    // This block is to restore `onServiceChange` and confirm Week Navigation start.
    // Actually, I can just use a separate call for calculateStats. 
    // Let's do `onServiceChange` first.

    generateWeekDays() {
        this.weekDays = [];
        const daysNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        // Clone the start date so we don't mutate it
        const start = new Date(this.currentWeekStart);

        for (let i = 0; i < 6; i++) {
            const date = new Date(start);
            // Add 'i' days
            date.setDate(this.currentWeekStart.getDate() + i); // Use currentWeekStart as base

            // Format YYYY-MM-DD manually to avoid timezone issues with toISOString() sometimes
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;

            this.weekDays.push({
                name: daysNames[i],
                date: dateStr,
                display: `${date.getDate()}` // Show day number
            });
        }
    }

    changeWeek(offset: number) {
        // Add or subtract 7 days
        this.currentWeekStart.setDate(this.currentWeekStart.getDate() + (offset * 7));
        this.generateWeekDays();
    }

    goToToday() {
        this.setInitialWeek();
    }

    // --- Persistence & Data ---

    loadAppointments() {
        const stored = localStorage.getItem('appointments');
        if (stored) {
            this.appointments = JSON.parse(stored);

            this.appointments.forEach(apt => {
                // Migrate legacy hour (number) to time (string)
                if (apt.hour !== undefined) {
                    apt.time = `${apt.hour}:00`;
                    delete apt.hour;
                }

                // Backfill prices for legacy data or ensure price is present
                if (!apt.price || apt.price === '0€') {
                    const foundService = this.servicesList.find(s => s.title === apt.type);
                    if (foundService) {
                        apt.price = foundService.price;
                    } else {
                        apt.price = '—'; // Fallback
                    }
                }
            });
        } else {
            // Seed initial data if empty (Optional, strictly for demo)
            this.seedInitialData();
        }
        this.calculateStats();
    }

    saveToStorage() {
        localStorage.setItem('appointments', JSON.stringify(this.appointments));
        this.calculateStats();
    }

    setFilter(type: 'day' | 'month' | 'year') {
        this.filterType = type;
        this.calculateStats();
    }

    calculateStats() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-11

        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        let filteredAppts = [];

        if (this.filterType === 'day') {
            filteredAppts = this.appointments.filter(a => a.date === todayStr);
        } else if (this.filterType === 'month') {
            filteredAppts = this.appointments.filter(a => {
                const parts = a.date.split('-');
                const aYear = parseInt(parts[0], 10);
                const aMonth = parseInt(parts[1], 10) - 1;
                return aYear === currentYear && aMonth === currentMonth;
            });
        } else if (this.filterType === 'year') {
            filteredAppts = this.appointments.filter(a => {
                const parts = a.date.split('-');
                const aYear = parseInt(parts[0], 10);
                return aYear === currentYear;
            });
        }

        // Pending and Count are ALWAYS for TODAY only
        const todaysAppts = this.appointments.filter(a => a.date === todayStr);

        this.stats.count = todaysAppts.length;
        this.stats.pending = todaysAppts.filter(a => this.getAppointmentStatus(a.date, a.time) === 'pending').length;

        this.stats.income = filteredAppts.reduce((acc, curr) => {
            // Fix: Handle comma properly (8,50 -> 8.50)
            const normalized = curr.price.replace(',', '.').replace(/[^\d.]/g, '');
            const priceVal = parseFloat(normalized) || 0;
            return acc + priceVal;
        }, 0);
    }

    seedInitialData() {
        // Just empty or some dummy example for "Today"
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        this.appointments = [
            { id: '1', date: todayStr, time: '10:00', client: 'Maria García', type: 'Corte de pelo', price: '25€' },
            { id: '2', date: todayStr, time: '12:00', client: 'Carlos Ruiz', type: 'Corte de pelo', price: '25€' }
        ];
        this.saveToStorage();
    }

    // --- CRUD ---

    getAppointment(dateStr: string, timeStr: string) {
        return this.appointments.find(a => a.date === dateStr && a.time === timeStr);
    }

    openNewModal(dateStr: string, timeStr: string) {
        this.isNew = true;
        this.currentAppointment = { id: '', date: dateStr, time: timeStr, client: '', type: '', price: '0€' };
        this.isModalOpen = true;
    }

    openEditModal(appointment: any) {
        this.isNew = false;
        // Deep copy
        this.currentAppointment = { ...appointment };
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    saveAppointment() {
        if (!this.currentAppointment.client) return; // Basic validation

        if (this.isNew) {
            // Generate simple ID
            this.currentAppointment.id = Math.random().toString(36).substr(2, 9);
            this.appointments.push({ ...this.currentAppointment });
        } else {
            // Update existing
            const index = this.appointments.findIndex(a => a.id === this.currentAppointment.id);
            if (index !== -1) {
                this.appointments[index] = { ...this.currentAppointment };
            }
        }
        this.saveToStorage();
        this.closeModal();
    }

    deleteAppointment() {
        if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
            this.appointments = this.appointments.filter(a => a.id !== this.currentAppointment.id);
            this.saveToStorage();
            this.closeModal();
        }
    }

    // --- Status Logic ---

    getAppointmentStatus(dateStr: string, timeStr: string): string {
        const now = new Date();

        // Parse "YYYY-MM-DD"
        const parts = dateStr.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);

        const [hours, minutes] = timeStr.split(':').map(Number);

        // Appointment Start Time
        const apptStart = new Date(year, month, day, hours, minutes, 0);

        // Appointment End Time (Start + 30 mins)
        const apptEnd = new Date(apptStart.getTime() + 30 * 60000);

        if (now >= apptEnd) {
            return 'completed';
        } else {
            return 'pending';
        }
    }

    getStatusClass(dateStr: string, timeStr: string) {
        const status = this.getAppointmentStatus(dateStr, timeStr);
        if (status === 'completed') {
            return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
        } else {
            // pending
            return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
        }
    }
}
