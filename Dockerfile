###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-alpine AS development

# 使用指定的用戶而不是root權限用戶
USER node

# 創建應用目錄
WORKDIR /workspace

# 複製依賴清單到容器鏡像裡.
# 複制package.json和yarn.lock, 複製到當前應用目錄.
# 首先複製這個選項可以防止在每次代碼更改時重新運行npm install.
COPY --chown=node:node package.json yarn.lock ./

# 安裝
RUN yarn install --frozen-lockfile

# 以node用戶權限執行，避免root
COPY --chown=node:node . .

###################
# BUILD FOR PRODUCTION
###################

FROM node:16-alpine AS build

USER node

WORKDIR /workspace

COPY --chown=node:node package.json yarn.lock ./

# 我們需要通過Nest CLI 來執行yarn build,這是個開發依賴
# 然後把安裝後依賴全部複製到指定目錄
COPY --chown=node:node --from=development /workspace/node_modules ./node_modules

COPY --chown=node:node . .

# 設置環境變量
ENV NODE_ENV local
ENV DB_HOST 127.0.0.1

# 執行打包命令
RUN yarn build

# 傳入 --production=true 確保只安裝了生產依賴項。這確保node_modules目錄盡可能優化
RUN yarn install --production=true --frozen-lockfile && yarn cache clean


###################
# PRODUCTION
###################

FROM node:16-alpine AS production

# 將生產依賴和打包後的文件複製到指定目錄下
COPY --chown=node:node --from=build /workspace/node_modules ./node_modules
COPY --chown=node:node --from=build /workspace/dist ./dist
COPY --chown=node:node migration-entrypoint.sh ./