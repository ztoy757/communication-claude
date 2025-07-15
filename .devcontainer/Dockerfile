FROM node:24-bullseye

RUN apt update -y \
    && apt install tmux -y

# Install install claude-code CLI
RUN npm install -g @anthropic-ai/claude-code \
    && npm update -g @anthropic-ai/claude-code

ENV HOME=/home/vscode
ENV NPM_CONFIG_PREFIX=$HOME/.npm-global
ENV PATH=$HOME/.npm-global/bin:$PATH

# vsocdeユーザの追加とnpm権限を追加
RUN adduser vscode \
    && mkdir -p $HOME/.npm-global \
    && chown -R vscode:vscode $HOME/.npm-global

RUN mkdir -p /workspace $HOME/.claude && \
  chown -R vscode:vscode /workspace $HOME/.claude

COPY entrypoint.sh /entrypoint.sh
RUN chown vscode:vscode /entrypoint.sh

USER vscode

WORKDIR /workspace
ENTRYPOINT ["/entrypoint.sh"]