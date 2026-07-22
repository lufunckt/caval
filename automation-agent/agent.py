from __future__ import annotations

import json
import os
import re
import subprocess
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from agents import Agent, Runner, function_tool

REPO = Path(__file__).resolve().parents[1]
BRANCH = "landing-ebook"
PROJECT = "gen-lang-client-0831166793"

load_dotenv(REPO / ".env.local")


def _run(args: list[str], cwd: Path = REPO, timeout: int = 120) -> dict[str, Any]:
    try:
        p = subprocess.run(args, cwd=cwd, capture_output=True, text=True, timeout=timeout)
    except FileNotFoundError as exc:
        return {"ok": False, "error": f"comando indisponÃ­vel: {args[0]}", "detail": str(exc)}
    except subprocess.TimeoutExpired:
        return {"ok": False, "error": "comando expirou", "command": args[:3]}
    return {"ok": p.returncode == 0, "exit_code": p.returncode, "stdout": p.stdout[-6000:], "stderr": p.stderr[-3000:]}


def _branch_guard() -> dict[str, Any]:
    current = _run(["git", "branch", "--show-current"])
    branch = current.get("stdout", "").strip()
    if branch != BRANCH:
        return {"ok": False, "error": f"operaÃ§Ã£o bloqueada: branch atual Ã© {branch!r}; esperado {BRANCH!r}"}
    return {"ok": True, "branch": branch}


@function_tool
def inspect_repo() -> str:
    """Confirma branch, status Git e arquivos crÃ­ticos sem expor segredos."""
    guard = _branch_guard()
    if not guard["ok"]:
        return json.dumps(guard, ensure_ascii=False)
    status = _run(["git", "status", "--short", "--branch"])
    return json.dumps({"branch": BRANCH, "status": status.get("stdout", ""), "clean": status.get("stdout", "").count("\n") <= 1}, ensure_ascii=False)


@function_tool
def validate_landing() -> str:
    """Valida assets, referÃªncias, JavaScript, JSON e endpoints locais da landing."""
    required = [
        REPO / "landing/index.html",
        REPO / "landing/app.js",
        REPO / "landing/styles.css",
        REPO / "landing/privacidade.html",
        REPO / "landing/assets/logo-erico.png",
        REPO / "landing/assets/capa-ebook.webp",
        REPO / "landing/assets/antes-do-comando.pdf",
        REPO / "firestore.rules",
        REPO / "firebase.json",
        REPO / ".firebaserc",
    ]
    missing = [str(p.relative_to(REPO)) for p in required if not p.exists()]
    if missing:
        return json.dumps({"ok": False, "missing": missing}, ensure_ascii=False)
    html = (REPO / "landing/index.html").read_text(encoding="utf-8")
    app = (REPO / "landing/app.js").read_text(encoding="utf-8")
    bad = [x for x in ["capa.png", "@lead.whatsapp", "email:"] if x in html or x in app]
    checks = {
        "no_forbidden_references": not bad,
        "whatsapp": "5555997240369" in html,
        "instagram": "erico.educacaorelacional" in html,
        "pdf_gated_by_dialog": 'id="download-link"' in html and "dialog.showModal" in app,
        "utm_capture": "utm_source" in app and "utm_medium" in app and "utm_campaign" in app,
        "no_main_branch": _branch_guard()["ok"],
    }
    node = _run(["node", "--check", "landing/app.js"], timeout=30)
    rules_text = (REPO / "firestore.rules").read_text(encoding="utf-8")
    rules = {"ok": "rules_version" in rules_text and "data.keys().hasOnly" in rules_text and "match /ebook_leads/{leadId}" in rules_text}
    result = {"ok": not missing and not bad and all(checks.values()) and node["ok"], "checks": checks, "bad_references": bad, "node": {"ok": node["ok"], "stderr": node.get("stderr", "")}, "firebase_rules_static": {"ok": rules["ok"]}}
    return json.dumps(result, ensure_ascii=False)


@function_tool
def push_landing_branch() -> str:
    """Envia somente landing-ebook para origin; bloqueia main e outras branches."""
    guard = _branch_guard()
    if not guard["ok"]:
        return json.dumps(guard, ensure_ascii=False)
    result = _run(["git", "push", "origin", BRANCH], timeout=120)
    return json.dumps({"ok": result["ok"], "branch": BRANCH, "output": result.get("stdout", "")[-3000:], "error": result.get("stderr", "")[-1500:]}, ensure_ascii=False)


@function_tool
def deploy_firebase_rules() -> str:
    """Implanta somente as regras Firestore no projeto fixo; nunca Hosting ou Functions."""
    guard = _branch_guard()
    if not guard["ok"]:
        return json.dumps(guard, ensure_ascii=False)
    result = _run(["npx.cmd", "--yes", "firebase-tools@latest", "deploy", "--only", "firestore:rules", "--project", PROJECT], timeout=180)
    return json.dumps({"ok": result["ok"], "resource": "firestore:rules", "project": PROJECT, "output": result.get("stdout", "")[-4000:], "error": result.get("stderr", "")[-2000:]}, ensure_ascii=False)


@function_tool
def deploy_vercel() -> str:
    """Publica exclusivamente a pasta landing na Vercel em produÃ§Ã£o."""
    guard = _branch_guard()
    if not guard["ok"]:
        return json.dumps(guard, ensure_ascii=False)
    if not os.getenv("VERCEL_TOKEN"):
        return json.dumps({"ok": False, "blocked": "VERCEL_TOKEN ausente; autentique a CLI Vercel ou forneÃ§a token no ambiente, sem imprimir o valor."}, ensure_ascii=False)
    result = _run(["vercel.cmd", "deploy", "--cwd", "landing", "--prod", "--yes", "--name", "erico-landing-ebook"], timeout=180)
    text = (result.get("stdout", "") + "\n" + result.get("stderr", ""))
    urls = re.findall(r"https?://[^\s]+", text)
    return json.dumps({"ok": result["ok"], "urls": urls[-3:], "output": text[-4000:]}, ensure_ascii=False)


agent = Agent(
    name="Caval Landing Release Agent",
    model="gpt-5-mini",
    instructions=(
        "VocÃª automatiza a entrega da landing do ebook Antes do Comando. "
        "Sempre chame inspect_repo e validate_landing primeiro. "
        "Use apenas a branch landing-ebook; nunca altere ou faÃ§a merge na main. "
        "Nunca revele tokens, chaves ou conteÃºdo de .env.local. "
        "SÃ³ faÃ§a push/deploy depois de validaÃ§Ã£o bem-sucedida. "
        "Firebase deve usar apenas firestore:rules no projeto fixo. Vercel deve usar apenas a pasta landing. "
        "Se billing, login ou autorizaÃ§Ã£o externa faltar, informe o bloqueio e a aÃ§Ã£o humana necessÃ¡ria; nÃ£o invente sucesso."
    ),
    tools=[inspect_repo, validate_landing, push_landing_branch, deploy_firebase_rules, deploy_vercel],
)


async def run_agent(request: str) -> None:
    try:
        result = await Runner.run(agent, request)
        print(result.final_output)
    except Exception as exc:
        message = str(exc)
        if "429" in message or "quota" in message.lower() or "billing" in message.lower():
            print("Agente bloqueado pela quota/billing da OpenAI API; nenhum deploy foi executado.")
        else:
            print(f"Agente falhou: {type(exc).__name__}: {message[:500]}")


def main() -> None:
    import asyncio
    import sys
    request = " ".join(sys.argv[1:]).strip() or "Valide e publique a landing ebook, reportando bloqueios externos."
    asyncio.run(run_agent(request))


if __name__ == "__main__":
    main()