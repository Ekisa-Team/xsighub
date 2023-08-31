import { Expose } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class BaseDto<PkType> {
  @Expose({ toClassOnly: true })
  @IsNotEmpty()
  readonly id: PkType;
}

export class BaseDtoWithTimestamps<PkType> extends BaseDto<PkType> {
  @Expose({ toClassOnly: true })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Expose({ toClassOnly: true })
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date | null;
}
