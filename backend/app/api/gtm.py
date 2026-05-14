"""
GTM Simulation Lab — API endpoints for GTM brief submission and preview.
"""

import os
import json
from flask import request, jsonify
from . import gtm_bp
from ..models.gtm_brief import GTMBriefManager
from ..utils.logger import get_logger

logger = get_logger('mirofish.api.gtm')

_MOCK_PREVIEW_PATH = os.path.join(
    os.path.dirname(__file__), '../../../../mock_data/gtm_preview.json'
)


def _load_mock_preview():
    """Load the static mock preview data from backend/mock_data/gtm_preview.json."""
    try:
        with open(_MOCK_PREVIEW_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.warning(f"Could not load mock preview data: {e}")
        return {"personas": [], "message_angle_teasers": []}


@gtm_bp.route('/brief', methods=['POST'])
def submit_brief():
    """
    POST /api/gtm/brief

    Accepts a GTM brief payload, validates it, persists it, and returns
    the brief_id for downstream simulation steps.
    """
    data = request.get_json(silent=True) or {}

    errors = GTMBriefManager.validate(data)
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400

    try:
        brief = GTMBriefManager.create_brief(data)
        logger.info(f"GTM brief created: {brief.brief_id}")
        return jsonify({
            'success': True,
            'data': {
                'brief_id': brief.brief_id,
                'brief': brief.to_dict(),
            }
        })
    except Exception as e:
        logger.error(f"Failed to create GTM brief: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@gtm_bp.route('/brief/<brief_id>', methods=['GET'])
def get_brief(brief_id: str):
    """GET /api/gtm/brief/<brief_id> — retrieve a stored GTM brief."""
    brief = GTMBriefManager.get_brief(brief_id)
    if not brief:
        return jsonify({'success': False, 'error': f'Brief not found: {brief_id}'}), 404
    return jsonify({'success': True, 'data': brief.to_dict()})


@gtm_bp.route('/brief/<brief_id>/preview', methods=['GET'])
def get_preview(brief_id: str):
    """
    GET /api/gtm/brief/<brief_id>/preview

    Returns a mock simulation preview (3 buyer personas + 2 message angle teasers).
    Phase 3 will replace this with real persona generation.
    """
    brief = GTMBriefManager.get_brief(brief_id)
    if not brief:
        return jsonify({'success': False, 'error': f'Brief not found: {brief_id}'}), 404

    preview = _load_mock_preview()
    return jsonify({'success': True, 'data': preview})


@gtm_bp.route('/briefs', methods=['GET'])
def list_briefs():
    """GET /api/gtm/briefs — list recent GTM briefs."""
    limit = request.args.get('limit', 20, type=int)
    briefs = GTMBriefManager.list_briefs(limit=limit)
    return jsonify({
        'success': True,
        'data': [b.to_dict() for b in briefs],
        'count': len(briefs),
    })
