import numpy as np
import matplotlib.pyplot as plt

# --- Parameters (use values from the book) ---
s_s = 0.71    # single survival
s_J = 0.60    # juvenile survival
p_s = 0.88    # pair survives and stays together
p_b = 0.056   # pair survives and splits
f   = 0.66    # offspring per pair
T   = 1000
Tprime = 1000
n = 20
m = 20

def M(Sm, U):
    # assume 2Sm < Tprime so min{T', 2Sm} = 2Sm
    return 1.0 - (1.0 - 2.0*Sm/Tprime)**n

def D(P, Sm, U):
    # assume P + Sm < U so A = U - P - Sm
    A = U - P - Sm
    return 1.0 - (1.0 - A/T)**m

def F(P, Sm, U):
    Mt = M(Sm, U)
    return p_s*P + s_s*Sm*Mt

def G(P, Sm, U):
    Dt = D(P, Sm, U)
    Mt = M(Sm, U)
    term_offspring = 0.5*f*s_J*Dt*P
    term_survive_single = s_s*Sm*(1.0 - Mt)
    term_split_pairs = p_b*P
    return term_offspring + term_survive_single + term_split_pairs

# --- Polynomial p(Sm) for fixed U ---
def p_poly(Sm, U):
    Mt = M(Sm, U)
    # at equilibrium Pbar given by (3.17)
    Pbar = (Sm * s_s * Mt) / (1.0 - p_s)
    Dt = D(Pbar, Sm, U)
    return -Sm + (0.5*f*s_J*Dt + p_b) * Pbar + Sm*s_s*(1.0 - Mt)

# Example: plot p(Sm) for different U values
def plot_polynomial():
    Sm_vals = np.linspace(0, 40, 400)
    for U in [100, 150, 200, 250]:
        p_vals = [p_poly(Sm, U) for Sm in Sm_vals]
        plt.plot(Sm_vals, p_vals, label=f"U={U}")
    
    plt.axhline(0, linestyle="--")
    plt.xlabel("S_m (single males)")
    plt.ylabel("p(S_m)")
    plt.ylim(-10, 10) 
    
    plt.legend()
    plt.title("Polynomial p(S_m) for different habitat sizes U")
    plt.show()

# --- Phase-plane trajectories for a fixed U ---
def simulate_trajectory(P0, Sm0, U, steps=100):
    P = np.zeros(steps+1)
    Sm = np.zeros(steps+1)
    P[0], Sm[0] = P0, Sm0
    for t in range(steps):
        P[t+1] = F(P[t], Sm[t], U)
        Sm[t+1] = G(P[t], Sm[t], U)
    return P, Sm

def plot_phase_plane(U=250):
    plt.figure()
    for (P0, Sm0) in [(5, 5), (20, 5), (5, 20), (30, 20)]:
        P, Sm = simulate_trajectory(P0, Sm0, U, steps=80)
        plt.plot(P, Sm, marker="o", markersize=2, linewidth=1,
                 label=f"IC: P0={P0}, Sm0={Sm0}")
    plt.xlabel("P (paired owls)")
    plt.ylabel("S_m (single males)")
    plt.title(f"Phase-plane trajectories, U={U}")
    plt.legend()
    plt.show()

plot_polynomial()
plot_phase_plane(U=250)