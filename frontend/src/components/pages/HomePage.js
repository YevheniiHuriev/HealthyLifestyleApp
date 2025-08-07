import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>HomePage</h1>
            <button onClick={() => navigate('/login')}>Auth</button>
        </div>
    );
}

export default HomePage;