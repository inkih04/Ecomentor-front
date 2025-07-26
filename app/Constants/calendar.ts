import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['es'] = {
    monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ],
    monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
    today: 'Hoy'
};

LocaleConfig.locales['en'] = {
    monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
    monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
    today: 'Today'
};

LocaleConfig.defaultLocale = 'en';

export interface CalendarEvent {
    id: number;
    title: string;
    description: string;
    date_ini: string;
    date_end: string;
    info_tickets: string;
    schedule: string;
    categories: {
        id: number;
        name: string;
    }[];
    images: {
        image_url: string;
    }[];
    location: {
        id: number;
        region: {
            id: number;
            name: string;
        };
        town: {
            id: number;
            name: string;
        };
        latitude: number;
        longitude: number;
        address: string;
        space: string;
    };
    links: {
        link: string;
    }[];
}

export interface CalendarEventProps extends CalendarEvent {
    color: string;
}

export const dummyEvents: CalendarEvent[] = [
    {
        id: 1,
        title: "Eco Fair 2024",
        description: "A fair promoting sustainable products and eco-friendly practices.",
        date_ini: "2025-07-10",
        date_end: "2025-07-12",
        info_tickets: "Free entry",
        schedule: "10:00 - 18:00",
        categories: [{ id: 1, name: "Sustainability" }],
        images: [],
        location: {
            id: 1,
            region: { id: 1, name: "Madrid" },
            town: { id: 1, name: "Madrid" },
            latitude: 40.4168,
            longitude: -3.7038,
            address: "Plaza Mayor, 1",
            space: "Main Hall"
        },
        links: [{ link: "https://example.com/eco-fair" }]
    },
    {
        id: 2,
        title: "Green Workshop",
        description: "Hands-on workshop on urban gardening.",
        date_ini: "2025-08-05",
        date_end: "2025-08-05",
        info_tickets: "Registration required",
        schedule: "15:00 - 17:00",
        categories: [{ id: 2, name: "Gardening" }],
        images: [{ image_url: "https://example.com/images/gardening.jpg" }],
        location: {
            id: 2,
            region: { id: 2, name: "Catalonia" },
            town: { id: 2, name: "Barcelona" },
            latitude: 41.3851,
            longitude: 2.1734,
            address: "Carrer de la Flor, 22",
            space: "Workshop Room"
        },
        links: [{ link: "https://example.com/green-workshop" }]
    },
    {
        id: 3,
        title: "Recycling Awareness Day",
        description: "Learn about recycling and waste reduction.",
        date_ini: "2025-09-15",
        date_end: "2025-09-15",
        info_tickets: "Open to all",
        schedule: "09:00 - 13:00",
        categories: [{ id: 3, name: "Recycling" }],
        images: [{ image_url: "https://example.com/images/recycling.jpg" }],
        location: {
            id: 3,
            region: { id: 3, name: "Andalusia" },
            town: { id: 3, name: "Seville" },
            latitude: 37.3891,
            longitude: -5.9845,
            address: "Avenida Verde, 10",
            space: "Auditorium"
        },
        links: [{ link: "https://example.com/recycling-day" }]
    },
    {
        id: 4,
        title: "Clean Beach Initiative",
        description: "Join us to clean the local beach and protect marine life.",
        date_ini: "2025-07-09",
        date_end: "2025-07-20",
        info_tickets: "Volunteer event",
        schedule: "08:00 - 12:00",
        categories: [{ id: 4, name: "Environment" }, { id: 8, name: "TEST" }],
        images: [{ image_url: "https://reactnative.dev/img/tiny_logo.png" },
        { image_url: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
        { image_url: "https://images.pexels.com/photos/1921326/pexels-photo-1921326.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },

        ],
        location: {
            id: 4,
            region: { id: 4, name: "Valencia" },
            town: { id: 4, name: "Valencia" },
            latitude: 39.4699,
            longitude: -0.3763,
            address: "Playa de la Malvarrosa",
            space: "Beachfront"
        },
        links: [{ link: "https://example.com/clean-beach" }]
    },
    {
        id: 5,
        title: "Sustainable Mobility Expo",
        description: "Explore eco-friendly transportation options.",
        date_ini: "2025-10-02",
        date_end: "2025-10-04",
        info_tickets: "Tickets available online",
        schedule: "11:00 - 19:00",
        categories: [{ id: 5, name: "Mobility" }],
        images: [{ image_url: "https://example.com/images/mobility.jpg" }],
        location: {
            id: 5,
            region: { id: 5, name: "Basque Country" },
            town: { id: 5, name: "Bilbao" },
            latitude: 43.2630,
            longitude: -2.9350,
            address: "Gran Via, 50",
            space: "Expo Center"
        },
        links: [{ link: "https://example.com/mobility-expo" }]
    },
    {
        id: 6,
        title: "Eco Film Night",
        description: "Screening of documentaries about climate change.",
        date_ini: "2025-11-12",
        date_end: "2025-11-12",
        info_tickets: "Limited seats",
        schedule: "18:30 - 21:00",
        categories: [{ id: 6, name: "Film" }],
        images: [{ image_url: "https://example.com/images/film-night.jpg" }],
        location: {
            id: 6,
            region: { id: 6, name: "Galicia" },
            town: { id: 6, name: "Santiago de Compostela" },
            latitude: 42.8782,
            longitude: -8.5448,
            address: "Rua do Cinema, 3",
            space: "Cinema Hall"
        },
        links: [{ link: "https://example.com/eco-film-night" }]
    }
];

export default {};