from pydantic import BaseModel

class UserInput(BaseModel):
    annual_income: float
    incentives: float
    platform_commission: float
    total_expenses: float
    weekly_work_hours: float
    orders_per_month: float
    debt_amount: float
    savings_rate: float
