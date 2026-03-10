import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LocusModule } from './locus/locus.module';
import { UsersModule } from './users/users.module';
import { LocusEntity } from './locus/entities/locus.entity';
import { LocusMemberEntity } from './locus/entities/locus-member.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        database: configService.get<string>('DB_NAME'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        entities: [LocusEntity, LocusMemberEntity],
        synchronize: false,
        logging: false,
        ssl: false
      }),
    }),
    AuthModule,
    UsersModule,
    LocusModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
