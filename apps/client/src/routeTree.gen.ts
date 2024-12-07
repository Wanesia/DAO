/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as UpdateProfileImport } from './routes/update-profile'
import { Route as UnauthorizedImport } from './routes/unauthorized'
import { Route as SettingsImport } from './routes/settings'
import { Route as RegisterImport } from './routes/register'
import { Route as ProfileImport } from './routes/profile'
import { Route as LoginImport } from './routes/login'
import { Route as EnsemblerImport } from './routes/ensembler'
import { Route as EnsembleImport } from './routes/ensemble'
import { Route as CreateEnsembleImport } from './routes/create-ensemble'
import { Route as AddInstrumentImport } from './routes/add-instrument'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const UpdateProfileRoute = UpdateProfileImport.update({
  id: '/update-profile',
  path: '/update-profile',
  getParentRoute: () => rootRoute,
} as any)

const UnauthorizedRoute = UnauthorizedImport.update({
  id: '/unauthorized',
  path: '/unauthorized',
  getParentRoute: () => rootRoute,
} as any)

const SettingsRoute = SettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const RegisterRoute = RegisterImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const ProfileRoute = ProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const EnsemblerRoute = EnsemblerImport.update({
  id: '/ensembler',
  path: '/ensembler',
  getParentRoute: () => rootRoute,
} as any)

const EnsembleRoute = EnsembleImport.update({
  id: '/ensemble',
  path: '/ensemble',
  getParentRoute: () => rootRoute,
} as any)

const CreateEnsembleRoute = CreateEnsembleImport.update({
  id: '/create-ensemble',
  path: '/create-ensemble',
  getParentRoute: () => rootRoute,
} as any)

const AddInstrumentRoute = AddInstrumentImport.update({
  id: '/add-instrument',
  path: '/add-instrument',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/add-instrument': {
      id: '/add-instrument'
      path: '/add-instrument'
      fullPath: '/add-instrument'
      preLoaderRoute: typeof AddInstrumentImport
      parentRoute: typeof rootRoute
    }
    '/create-ensemble': {
      id: '/create-ensemble'
      path: '/create-ensemble'
      fullPath: '/create-ensemble'
      preLoaderRoute: typeof CreateEnsembleImport
      parentRoute: typeof rootRoute
    }
    '/ensemble': {
      id: '/ensemble'
      path: '/ensemble'
      fullPath: '/ensemble'
      preLoaderRoute: typeof EnsembleImport
      parentRoute: typeof rootRoute
    }
    '/ensembler': {
      id: '/ensembler'
      path: '/ensembler'
      fullPath: '/ensembler'
      preLoaderRoute: typeof EnsemblerImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/profile': {
      id: '/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof ProfileImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      id: '/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    '/unauthorized': {
      id: '/unauthorized'
      path: '/unauthorized'
      fullPath: '/unauthorized'
      preLoaderRoute: typeof UnauthorizedImport
      parentRoute: typeof rootRoute
    }
    '/update-profile': {
      id: '/update-profile'
      path: '/update-profile'
      fullPath: '/update-profile'
      preLoaderRoute: typeof UpdateProfileImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/add-instrument': typeof AddInstrumentRoute
  '/create-ensemble': typeof CreateEnsembleRoute
  '/ensemble': typeof EnsembleRoute
  '/ensembler': typeof EnsemblerRoute
  '/login': typeof LoginRoute
  '/profile': typeof ProfileRoute
  '/register': typeof RegisterRoute
  '/settings': typeof SettingsRoute
  '/unauthorized': typeof UnauthorizedRoute
  '/update-profile': typeof UpdateProfileRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/add-instrument': typeof AddInstrumentRoute
  '/create-ensemble': typeof CreateEnsembleRoute
  '/ensemble': typeof EnsembleRoute
  '/ensembler': typeof EnsemblerRoute
  '/login': typeof LoginRoute
  '/profile': typeof ProfileRoute
  '/register': typeof RegisterRoute
  '/settings': typeof SettingsRoute
  '/unauthorized': typeof UnauthorizedRoute
  '/update-profile': typeof UpdateProfileRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/add-instrument': typeof AddInstrumentRoute
  '/create-ensemble': typeof CreateEnsembleRoute
  '/ensemble': typeof EnsembleRoute
  '/ensembler': typeof EnsemblerRoute
  '/login': typeof LoginRoute
  '/profile': typeof ProfileRoute
  '/register': typeof RegisterRoute
  '/settings': typeof SettingsRoute
  '/unauthorized': typeof UnauthorizedRoute
  '/update-profile': typeof UpdateProfileRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/add-instrument'
    | '/create-ensemble'
    | '/ensemble'
    | '/ensembler'
    | '/login'
    | '/profile'
    | '/register'
    | '/settings'
    | '/unauthorized'
    | '/update-profile'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/add-instrument'
    | '/create-ensemble'
    | '/ensemble'
    | '/ensembler'
    | '/login'
    | '/profile'
    | '/register'
    | '/settings'
    | '/unauthorized'
    | '/update-profile'
  id:
    | '__root__'
    | '/'
    | '/add-instrument'
    | '/create-ensemble'
    | '/ensemble'
    | '/ensembler'
    | '/login'
    | '/profile'
    | '/register'
    | '/settings'
    | '/unauthorized'
    | '/update-profile'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AddInstrumentRoute: typeof AddInstrumentRoute
  CreateEnsembleRoute: typeof CreateEnsembleRoute
  EnsembleRoute: typeof EnsembleRoute
  EnsemblerRoute: typeof EnsemblerRoute
  LoginRoute: typeof LoginRoute
  ProfileRoute: typeof ProfileRoute
  RegisterRoute: typeof RegisterRoute
  SettingsRoute: typeof SettingsRoute
  UnauthorizedRoute: typeof UnauthorizedRoute
  UpdateProfileRoute: typeof UpdateProfileRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AddInstrumentRoute: AddInstrumentRoute,
  CreateEnsembleRoute: CreateEnsembleRoute,
  EnsembleRoute: EnsembleRoute,
  EnsemblerRoute: EnsemblerRoute,
  LoginRoute: LoginRoute,
  ProfileRoute: ProfileRoute,
  RegisterRoute: RegisterRoute,
  SettingsRoute: SettingsRoute,
  UnauthorizedRoute: UnauthorizedRoute,
  UpdateProfileRoute: UpdateProfileRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/add-instrument",
        "/create-ensemble",
        "/ensemble",
        "/ensembler",
        "/login",
        "/profile",
        "/register",
        "/settings",
        "/unauthorized",
        "/update-profile"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/add-instrument": {
      "filePath": "add-instrument.tsx"
    },
    "/create-ensemble": {
      "filePath": "create-ensemble.tsx"
    },
    "/ensemble": {
      "filePath": "ensemble.tsx"
    },
    "/ensembler": {
      "filePath": "ensembler.tsx"
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/profile": {
      "filePath": "profile.tsx"
    },
    "/register": {
      "filePath": "register.tsx"
    },
    "/settings": {
      "filePath": "settings.tsx"
    },
    "/unauthorized": {
      "filePath": "unauthorized.tsx"
    },
    "/update-profile": {
      "filePath": "update-profile.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
