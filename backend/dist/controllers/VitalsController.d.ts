import { Request, Response } from 'express';
export declare class VitalsController {
    private static vitalsRepository;
    static logVitals(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getLogs(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=VitalsController.d.ts.map