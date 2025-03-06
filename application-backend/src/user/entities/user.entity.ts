import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import crypto from 'crypto';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ 
        required: true, 
        default: () => crypto.randomUUID() 
    })
    id: number;

    @Prop({ 
        required: true, 
        type: [mongoose.Schema.Types.String], 
        trim: true, 
    })
    username: string;

    @Prop({ 
        required: true, 
        type: [mongoose.Schema.Types.String] 
    })
    password: string;

    @Prop({ 
        required: true, 
        type: [mongoose.Schema.Types.String], 
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido'] 
    })
    email: string;

    createdAt!: Date;
    updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
