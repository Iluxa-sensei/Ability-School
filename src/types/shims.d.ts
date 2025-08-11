// Fallback shims to satisfy the TypeScript linter if local type resolution fails.
// These keep developer ergonomics while avoiding noisy errors in certain environments.

declare module "@react-three/fiber" {
    export const Canvas: any;
    export function useFrame(cb: (state: any, delta: number) => void): void;
}

declare module "@react-three/drei" {
    export const Environment: any;
    export const OrbitControls: any;
    export function useAnimations(animations: any, root?: any): { actions?: Record<string, any>; mixer?: any };
    export function useGLTF(url: string | any): any;
    export namespace useGLTF {
        function preload(url: string): void;
    }
}

declare module "three" {
    const three: any;
    export = three;
}

declare namespace JSX {
    interface IntrinsicElements {
        primitive: any;
        group: any;
        hemisphereLight: any;
        directionalLight: any;
    }
}


