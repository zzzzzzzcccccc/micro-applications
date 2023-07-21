# Micro Applications

Micro front-end framework, support react or vue

## Modules

### libs

| Name | Docs |
|------|-------------|
| Configuration |  [Doc](packages/configuration/README.md)          |
| Logger        | [Doc](packages/logger/README.md)
| Sdk          |  [Doc](packages/sdk/README.md)            |
| Hooks      |  [Doc](packages/hooks/README.md)            |

### apps
| Name | Description |
|------|-------------|
| runtime | Host application by react   |
| home | Child application by react   |
| login | Child application by react-component |
| dashboard | Child application by react |
| dashboard-panel | Child application by react-component in dashboard |
| dashboard-container | Child application by react-component in dashboard |

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
