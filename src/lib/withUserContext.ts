import { asyncLocalStorage } from './context';
import { getServerSession } from 'next-auth/next';

export default function withUserContext(handler) {
    return async (req, res) => {
        const session = await getServerSession(req, res, authOptions);
        const userId = session?.user?.id;

        await asyncLocalStorage.run({ userId }, async () => {
            await handler(req, res);
        });
    };
}