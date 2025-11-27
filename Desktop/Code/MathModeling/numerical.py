import numpy as np
from mpmath import findroot
import pandas as pd

# Parameters
s_s = 0.71
s_J = 0.60
p_s = 0.88
p_b = 0.056
f   = 0.66
m = n = 20
T = T_prime = 1000.0

def M(Sm):
    """Mate-finding term M_t as a function of S_m."""
    frac = min(T_prime, 2.0 * Sm) / T_prime
    return 1.0 - (1.0 - frac)**n

def P_from_Sm(Sm):
    """Equilibrium relation P = s_s * S_m * M / (1 - p_s)."""
    return s_s * Sm * M(Sm) / (1.0 - p_s)

def D(P, Sm, U):
    """Dispersal-success term D_t as a function of (P, S_m)."""
    frac = (U - P - Sm) / T
    # Clamp to [0,1] to avoid numerical issues
    frac = max(0.0, min(1.0, frac))
    return 1.0 - (1.0 - frac)**m

def F(P, Sm):
    """P_{t+1} = F(P_t, S_{m,t})."""
    return p_s * P + s_s * Sm * M(Sm)

def G(P, Sm, U):
    """S_{m,t+1} = G(P_t, S_{m,t})."""
    return (
        0.5 * f * s_J * D(P, Sm, U) * P
        + s_s * Sm * (1.0 - M(Sm))
        + p_b * P
    )

def poly(Sm, U):
    """Scalar equilibrium equation p(S_m) = 0."""
    P  = P_from_Sm(Sm)
    Mt = M(Sm)
    Dt = D(P, Sm, U)
    return -Sm + (
        (0.5 * f * s_J * Dt + p_b) * (s_s * Sm * Mt) / (1.0 - p_s)
        + s_s * Sm * (1.0 - Mt)
    )

def positive_equilibria(U):
    """Find positive roots S_m > 0 of p(S_m) = 0."""
    roots = []
    guesses = [5.0 * k for k in range(1, 41)]  # 5, 10, ..., 200
    for g in guesses:
        try:
            r = float(findroot(lambda x: poly(x, U), g))
            if r > 1e-6:
                # Avoid duplicates
                if all(abs(r - r0) > 1e-3 for r0 in roots):
                    roots.append(r)
        except:
            # findroot can fail for some guesses; just skip
            pass
    return sorted(roots)

def jacobian(P, Sm, U, h=1e-4):
    """Numerical Jacobian of (F, G) using central differences."""
    # Partial derivatives of F
    F_P  = (F(P + h, Sm) - F(P - h, Sm)) / (2.0 * h)
    F_Sm = (F(P, Sm + h) - F(P, Sm - h)) / (2.0 * h)

    # Partial derivatives of G
    G_P  = (G(P + h, Sm, U) - G(P - h, Sm, U)) / (2.0 * h)
    G_Sm = (G(P, Sm + h, U) - G(P, Sm - h, U)) / (2.0 * h)

    return np.array([[F_P,  F_Sm],
                     [G_P,  G_Sm]])

if __name__ == "__main__":
    U_values = [100, 150, 200, 250]

    rows = []

    for U in U_values:
        roots = positive_equilibria(U)
        for idx, Sm in enumerate(roots, start=1):
            P = P_from_Sm(Sm)
            J = jacobian(P, Sm, U)
            vals, _ = np.linalg.eig(J)
            lam1, lam2 = vals[0], vals[1]
            abs_lam1, abs_lam2 = abs(lam1), abs(lam2)
            max_abs = max(abs_lam1, abs_lam2)
            stability = "stable" if max_abs < 1.0 else "unstable"

            rows.append({
                "U": U,
                "equilibrium_index": idx,
                "P": P,
                "S_m": Sm,
                "lambda_1": lam1,
                "lambda_2": lam2,
                "|lambda_1|": abs_lam1,
                "|lambda_2|": abs_lam2,
                "max|lambda|": max_abs,
                "stability": stability,
            })

    df = pd.DataFrame(rows)
    print(df)
