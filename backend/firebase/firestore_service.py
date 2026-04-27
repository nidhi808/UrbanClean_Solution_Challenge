from firebase.config import db
import datetime

def save_issue(issue_data: dict):
    if not db:
        return {"error": "Firebase not initialized"}
    
    doc_ref = db.collection('issues').document()
    issue_data['id'] = doc_ref.id
    issue_data['timestamp'] = datetime.datetime.utcnow()
    doc_ref.set(issue_data)
    return issue_data

def save_resource_data(resource_data: dict):
    if not db:
        return {"error": "Firebase not initialized"}
    
    doc_ref = db.collection('resource_data').document()
    resource_data['timestamp'] = datetime.datetime.utcnow()
    doc_ref.set(resource_data)
    return resource_data

def create_alert(issue_id: str, message: str, priority: str):
    if not db:
        return {"error": "Firebase not initialized"}
    
    alert_data = {
        'issue_id': issue_id,
        'message': message,
        'priority': priority,
        'timestamp': datetime.datetime.utcnow()
    }
    db.collection('alerts').add(alert_data)
    return alert_data
