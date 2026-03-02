import React from 'react';
import { LoadBalancerDemo, ClientServerDemo, ApiGatewayDemo, DatabaseShardingDemo, CachingDemo, DockerDemo, MessageQueueDemo, BackendLanguagesDemo, HldLldExplainer, DbInternalsDemo, FullStackHowTo, ConsistentHashingDemo, DbMigrationDemo, DevOpsLoopDemo } from '../system-design';
import { UrlShortenerDemo, InstagramDemo, UberDemo, QuadtreeVisualizer } from '../case-studies';
import { GameArchDemo, GameLoopDemo, GameIntroDemo, GameNetworkingDemo, HitDetectionDemo, OrderMatchingDemo } from '../gaming';
import { EncryptionDemo, SqlInjectionDemo, AESDemo, RSADemo, SHADemo, BcryptDemo } from '../Cybersecurity';
import { UniversalSystemDemo } from '../ui';
import { GameState, CodeSnippet } from '../../types';
import { COURSE_CONTENT } from '../../data/courseContent';

interface LevelRendererProps {
    gameState: GameState;
    onShowCode: () => void;
    onProgress: (data: { sectionIndex: number; totalSections: number }) => void;
    initialSectionIndex?: number;
}

export const LevelRenderer: React.FC<LevelRendererProps> = ({
    gameState,
    onShowCode,
    onProgress,
    initialSectionIndex,
}) => {
    const currentLevel = COURSE_CONTENT.find(l => l.id === gameState);

    switch (gameState) {
        case GameState.LEVEL_HLD_LLD:
            return <HldLldExplainer />;
        case GameState.LEVEL_BACKEND_LANGUAGES:
            return <BackendLanguagesDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_CLIENT_SERVER:
            return <ClientServerDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_LOAD_BALANCER:
            return <LoadBalancerDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_API_GATEWAY:
            return <ApiGatewayDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_CACHING:
            return <CachingDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_DB_SHARDING:
            return <DatabaseShardingDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_DOCKER:
            return <DockerDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_MESSAGE_QUEUES:
            return <MessageQueueDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_DB_INTERNALS:
            return <DbInternalsDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_DEVOPS_LOOP:
            return <DevOpsLoopDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_FULL_STACK_HOWTO:
            return <FullStackHowTo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_CONSISTENT_HASHING:
            return <ConsistentHashingDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_DB_MIGRATIONS:
            return <DbMigrationDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.CASE_URL_SHORTENER:
            return <UrlShortenerDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.CASE_INSTAGRAM:
            return <InstagramDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.CASE_UBER:
            return <UberDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_QUADTREE_DEEP_DIVE:
            return <QuadtreeVisualizer onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_GAME_INTRO:
            return <GameIntroDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_GAME_ARCH:
            return <GameArchDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_GAME_NETWORKING:
            return <GameNetworkingDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_GAME_PHYSICS:
            return <HitDetectionDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_GAME_LOOP:
            return <GameLoopDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_ORDER_BOOK:
            return <OrderMatchingDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_CYBER_ENCRYPTION:
            return <EncryptionDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_CYBER_SQLI:
            return <SqlInjectionDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_CYBER_AES:
            return <AESDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_CYBER_RSA:
            return <RSADemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_CYBER_SHA:
            return <SHADemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        case GameState.LEVEL_CYBER_BCRYPT:
            return <BcryptDemo onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} />;
        default:
            return currentLevel ? <UniversalSystemDemo level={currentLevel} onShowCode={onShowCode} onProgress={onProgress} initialSectionIndex={initialSectionIndex} /> : null;
    }
};
