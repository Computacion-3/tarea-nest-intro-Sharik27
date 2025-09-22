import { User } from 'src/users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('games')
export class Game {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    minPlayers: number;

    @Column()
    maxPlayers: number;

    @Column()
    category: string;

    @ManyToOne(()=> User, (user) => user.games, {eager: true})
    @JoinColumn({name:'user_id'})
    createdBy: User;

}
