import { container } from 'tsyringe';
import { UserRepository } from '@repositories/user-repository.interface';
import { UserRepositoryImpl } from '@infra/database/repositories/user.repository';
import { CreateUserUseCase } from '@usecases/create-user.usecase';
import { HashService } from '@services/hash-service.interface';
import { TokenService } from '@services/token-service.interface';
import { Logger } from '@domain/services/logger.interface';
import { BcryptService } from '@infra/auth/bcrypt.service';
import { JwtService } from '@infra/auth/jwt.service';
import { ConsoleLogger } from '@infra/logging/console.logger';
import { UserAdapter } from '@infra/http/adapters/user.adapter';
import { AuthAdapter } from '@infra/http/adapters/auth.adapter';
import { MeetingRoomRepository } from '@domain/repositories/meeting-room-repository.interface';
import { BookingRepository } from '@domain/repositories/booking-repository.interface';
import { PrismaMeetingRoomRepository } from '@infra/database/repositories/meeting-room.repository';
import { PrismaBookingRepository } from '@infra/database/repositories/booking.repository';
import { PrismaClient } from '@prisma/client';
import { MeetingRoomAdapter } from '@infra/http/adapters/meeting-room.adapter';
import { BookingAdapter } from '@infra/http/adapters/booking.adapter';
import { CreateMeetingRoomUseCase } from '@usecases/create-meeting-room.usecase';
import { CreateBookingUseCase } from '@usecases/create-booking.usecase';
import { SendBookingConfirmationUseCase } from '@usecases/send-booking-confirmation.usecase';
import { AuthorizationServiceImpl } from '@infra/auth/authorization.service';
import { AuthorizationService } from '@services/authorization-service.interface';

container.registerSingleton<UserRepository>('UserRepository', UserRepositoryImpl);
container.registerSingleton<MeetingRoomRepository>('MeetingRoomRepository', PrismaMeetingRoomRepository);
container.registerSingleton<BookingRepository>('BookingRepository', PrismaBookingRepository);
container.registerInstance(PrismaClient, new PrismaClient());

container.registerSingleton(CreateUserUseCase);
container.registerSingleton(CreateMeetingRoomUseCase);
container.registerSingleton(CreateBookingUseCase);
container.registerSingleton(SendBookingConfirmationUseCase);

container.registerSingleton<HashService>('HashService', BcryptService);
container.registerSingleton<TokenService>('TokenService', JwtService);
container.registerSingleton<Logger>('Logger', ConsoleLogger);

container.registerSingleton(UserAdapter);
container.registerSingleton(AuthAdapter);
container.registerSingleton(MeetingRoomAdapter);
container.registerSingleton(BookingAdapter);

container.registerSingleton<AuthorizationService>('AuthorizationService', AuthorizationServiceImpl);

const logger = container.resolve<Logger>('Logger');
logger.info('Container initialized with all dependencies');