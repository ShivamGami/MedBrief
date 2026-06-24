from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .DataBase.Database import engine, Base
from .Router.Auth_Router import router as auth_router
from .Router.Personal_Data_Router import router as personal_router
from .Router.Medical_Data_Router import router as medical_router
from .Router.Medicine_Data_Router import router as medicine_router
from .Router.System_Data_Router import router as system_router
from .Security.Settings import settings

app = FastAPI(
    title="MedBrief AI",
    version="1.0.0",
    description="Backend API for MedBrief AI"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):(5173|4173)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(personal_router)
app.include_router(medical_router)
app.include_router(medicine_router)
app.include_router(system_router)

Base.metadata.create_all(bind=engine)


@app.get("/", tags=["Root"])
async def root():
    return {"message": "MedBrief AI backend is running"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
