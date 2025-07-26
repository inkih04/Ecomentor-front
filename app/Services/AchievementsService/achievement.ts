import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import logro1 from '@/assets/images/logro1.png';
import logro2 from '@/assets/images/logro2.png';
import logro3 from '@/assets/images/logro3.png';
import logro4 from '@/assets/images/logro4.png';
import logro5 from '@/assets/images/logro5.png';
import logro6 from '@/assets/images/logro6.png';
import logro7 from '@/assets/images/logro7.png';
import logro8 from '@/assets/images/logro8.png';
import logro9 from '@/assets/images/logro9.png';
import logro10 from '@/assets/images/logro10.png';
import logro11 from '@/assets/images/logro11.png';
import logro12 from '@/assets/images/logro12.png';

export interface Achievement {
    achievementName: string;
    maxProgress: number;
    actualProgress: number;
}

export default Achievement;

export const achievementIcons: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    "1": "verified",
    "2": "grade",
    "3": "star-half",
    "4": "star",
    "5": "school",
    "6": "assignment-turned-in",
    "7": "fact-check",
    "8": "emoji-events",
    "9": "emoji-events",
    "10": "stars",
    "11": "chat-bubble",
    "12": "mood-bad",
};



export const achievementImages: Record<string, any> = {
    '1.png': logro1,
    '2.png': logro2,
    '3.png': logro3,
    '4.png': logro4,
    '5.png': logro5,
    '6.png': logro6,
    '7.png': logro7,
    '8.png': logro8,
    '9.png': logro9,
    '10.png': logro10,
    '11.png': logro11,
    '12.png': logro12,
};
