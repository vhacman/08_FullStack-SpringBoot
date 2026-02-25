export interface Guest {
    id?:number;
    firstName:string;
    lastName:string;
    ssn:string;
    dob?:Date;
    address:string;
    city:string;
}

export interface Room {
    id?:number;
    name:string;
    description:string;
    basePrice:number;
    hotelId:number;
}

export interface Booking{
    id?:number;
    guestId:number;
    roomId:number;
    guest:Guest;
    room:Room;
    from:Date;
    to:Date;
    notes:string;
    //aggiunti per soddisfare necessità del backend
    status:string;
    price:number;
    //aggiungo campo cleaned:boolean
    cleaned:boolean
}

export interface Hotel{
    id:number;
    name:string;
    address:string;
    city:string;
}

export interface User{
    id:number;
    email:string;
    firstName:string;
    lastName:string;
    role:string;
    hotel:Hotel;
}
