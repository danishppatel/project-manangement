import ProjectDetailPage from '@/components/templates/ProjectDetailPage';
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
interface Props {
    params: Promise<{
        id: string; uid: string 
    }>
}
export default async function ProjectPage({ params }: Props) {
    const id = await params

    return ( 
    <ProtectedRoute>
        <ProjectDetailPage projectId={id.id} />
    </ProtectedRoute>
    );

}
 