import { Module } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationEnity } from './entities/registration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegistrationEnity])],
  controllers: [RegistrationsController],
  providers: [RegistrationsService]
})
export class RegistrationsModule { }
