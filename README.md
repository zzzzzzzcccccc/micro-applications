# Micro Applications

Micro front-end framework, support react or vue

## Modules

### libs

| Name | Docs |
|------|-------------|
| Configuration |  [Doc](packages/configuration/README.md)          |
| Sdk          |  [Doc](packages/sdk/README.md)            |
| Hooks      |  [Doc](packages/hooks/README.md)            |

### apps
| Name | Description |
|------|-------------|
| runtime | Host application by react   |
| home | Child application by react   |
| login | Child application by vue |
| dashboard | Child application by react and vue |
| dashboard-panel | Child application by react in dashboard |
| dashboard-container | Child application by vue in dashboard |

### services

| Name | Description |
| ------ | ------ |
| prisma | Database service |
| web | Web service |

## Setup

### ui

```shell
yarn start
```

### services

```shell
yarn start:service:web
```
