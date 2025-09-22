import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GamesService {

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private usersService: UsersService,
  ){}

  async create(createGameDto: CreateGameDto) {

    const createdBy = await this.usersService.findByUsername(createGameDto.username);

    if(!createdBy){
      throw new Error('User not found');
    }

    const newGame = this.gameRepository.create({
      ...createGameDto,
      createdBy,
    });

    
    return await this.gameRepository.save(newGame);
  }

  findAll() {
    return this.gameRepository.find();
  }

  findOne(id: number) {
    return this.gameRepository.findOne({ where: { id } });
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    await this.gameRepository.update(id, updateGameDto);

    return this.findOne(id);
  }

  async remove(id: number) {

    const result = await this.gameRepository.delete(id);

    if(result.affected){
      return { id }
    }

    return null;
  }
}