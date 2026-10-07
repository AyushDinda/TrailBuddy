import urllib.request
import json
import sys

base_api = 'http://localhost:8000/api'
frontend_url = 'http://localhost:5173'

def run_tests():
    # 1. Health check
    print('--- 1. Testing GET /api/health ---')
    with urllib.request.urlopen(f'{base_api}/health') as res:
        data = json.loads(res.read().decode())
        print('Health status:', data['status'], '| Model:', data['ollama_model'], '| Mock AI:', data['mock_ai'])
        assert data['status'] == 'healthy'

    # 2. Generate Mission
    print('\n--- 2. Testing POST /api/missions/generate ---')
    gen_payload = {
        'duration': 45,
        'activity': 'Walking',
        'mood': 'Curious',
        'difficulty': 'Easy',
        'interests': ['Nature', 'Photography'],
        'additional_context': 'Notice small details in the park',
        'location_context': 'Oak neighborhood greenway'
    }
    req = urllib.request.Request(
        f'{base_api}/missions/generate',
        data=json.dumps(gen_payload).encode(),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req) as res:
        mission = json.loads(res.read().decode())
        print('Generated Title:', mission['title'])
        print('Tagline:', mission['tagline'])
        print(f"Duration: {mission['duration_minutes']} min | Screen-free: {mission['screen_free_minutes']} min")
        print('Steps count:', len(mission['steps']))
        for i, s in enumerate(mission['steps']):
            print(f"  Step {i+1}: {s['title']} - {s['description']}")
        assert 'title' in mission and len(mission['steps']) >= 1

    # 3. Save Mission to SQLite
    print('\n--- 3. Testing POST /api/missions (Save to SQLite) ---')
    save_payload = {
        'title': mission['title'],
        'tagline': mission['tagline'],
        'activity': mission['activity'],
        'duration_minutes': mission['duration_minutes'],
        'difficulty': mission['difficulty'],
        'mission_json': mission,
        'completed': False
    }
    req_save = urllib.request.Request(
        f'{base_api}/missions',
        data=json.dumps(save_payload).encode(),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req_save) as res:
        saved = json.loads(res.read().decode())
        mission_id = saved['id']
        print(f"Saved to DB with ID: {mission_id} | Completed: {saved['completed']}")
        assert saved['id'] > 0

    # 4. Complete Mission with Reflection & Feeling
    print(f'\n--- 4. Testing PATCH /api/missions/{mission_id}/complete ---')
    comp_payload = {
        'feeling': 'Energizing',
        'reflection': 'I noticed the smell of wet soil, pine bark textures, and heard distant songbirds.'
    }
    req_comp = urllib.request.Request(
        f'{base_api}/missions/{mission_id}/complete',
        data=json.dumps(comp_payload).encode(),
        headers={'Content-Type': 'application/json'},
        method='PATCH'
    )
    with urllib.request.urlopen(req_comp) as res:
        completed_mission = json.loads(res.read().decode())
        print('Mission completed:', completed_mission['completed'])
        print('Feeling:', completed_mission['feeling'])
        print('Reflection:', completed_mission['reflection'])
        print('Completed at:', completed_mission['completed_at'])
        assert completed_mission['completed'] is True
        assert completed_mission['feeling'] == 'Energizing'

    # 5. List Mission History
    print('\n--- 5. Testing GET /api/missions (History Archive) ---')
    with urllib.request.urlopen(f'{base_api}/missions') as res:
        history = json.loads(res.read().decode())
        print(f"Total missions in history archive: {len(history)}")
        for h in history:
            print(f"  [ID {h['id']}] {h['title']} ({h['activity']} - {h['duration_minutes']}m) -> Felt: {h['feeling']}")
        assert len(history) >= 1

    # 6. Verify Frontend HTML and Vite Proxy
    print('\n--- 6. Testing Frontend serving & Proxy ---')
    with urllib.request.urlopen(frontend_url) as res:
        html = res.read().decode()
        print('Frontend HTML Status: 200 OK | Title Tag Present:', 'TrailBuddy' in html)
        assert 'TrailBuddy' in html

    # 7. Testing Frontend Proxy to /api/health
    with urllib.request.urlopen(f'{frontend_url}/api/health') as res:
        proxied = json.loads(res.read().decode())
        print('Vite Proxy /api/health Status: 200 OK | Project:', proxied['project'])
        assert proxied['status'] == 'healthy'

    print('\n======================================================')
    print('ALL 7 FULL END-TO-END VERIFICATION CHECKS PASSED 100%!')
    print('======================================================')

if __name__ == '__main__':
    run_tests()
