import { FactoryProvider, ModuleMetadata } from '@nestjs/common'

import { TypeOptions } from '@/api/auth/provider/types/type-options.type'

export type TypeAsyncOptions = Pick<ModuleMetadata, 'imports'> &
	Pick<FactoryProvider<TypeOptions>, 'useFactory' | 'inject'>
